import { SignJWT, jwtVerify } from 'jose';

const getSecret = (envVar: string, fallback: string) => {
  const secret = process.env[envVar];
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`CRITICAL SECURITY ERROR: ${envVar} is not set in production!`);
    }
    return new TextEncoder().encode(fallback);
  }
  return new TextEncoder().encode(secret);
};

const STUDENT_SECRET = getSecret('JWT_SECRET', 'student-secret-dev');
const ADMIN_SECRET = getSecret('ADMIN_JWT_SECRET', 'admin-secret-dev');

export async function signStudentToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(STUDENT_SECRET);
}

export async function verifyStudentToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, STUDENT_SECRET);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function signAdminToken() {
  return await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(ADMIN_SECRET);
}

export async function signExamStart(studentId: string) {
  return await new SignJWT({ studentId, startTime: Date.now() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('4h')
    .sign(STUDENT_SECRET);
}

export async function verifyExamStart(token: string) {
  try {
    const { payload } = await jwtVerify(token, STUDENT_SECRET);
    return payload as { studentId: string; startTime: number };
  } catch (e) {
    return null;
  }
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_SECRET);
    return payload;
  } catch (e) {
    return null;
  }
}
