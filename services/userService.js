const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function getUserByUsername(username) {
    return prisma.user.findUnique({ where: { username } });
}

async function getUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
}

async function insertUser(username, email, password) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return prisma.user.create({
        data: {
            username,
            email,
            passwordHash,
            verificationToken: token,
            verificationExpiresAt: expiresAt,
        },
        select: { id: true, username: true, email: true, verificationToken: true },
    });
}

async function verifyUserByToken(token) {
    const user = await prisma.user.findFirst({
        where: { verificationToken: token },
    });
    if (!user) return { error: 'Invalid verification link.' };
    if (new Date() > new Date(user.verificationExpiresAt)) {
        return { error: 'Verification link has expired. Please sign up again.' };
    }
    await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationToken: null,
            verificationExpiresAt: null,
        },
    });
    return { success: true };
}

async function refreshVerificationToken(email) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const result = await prisma.user.updateMany({
        where: { email, isVerified: false },
        data: {
            verificationToken: token,
            verificationExpiresAt: expiresAt,
        },
    });
    // result.count === 0 means no unverified user with that email
    return result.count > 0 ? token : null;
}

module.exports = {
    getUserByUsername,
    getUserByEmail,
    insertUser,
    verifyUserByToken,
    refreshVerificationToken,
};