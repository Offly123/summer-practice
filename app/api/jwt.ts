// "Библиотека" для работы с JWT

const { createHmac } = require('crypto');


interface JWT {
    header: JWTHeader,
    payload: JWTPayload,
    signature: string
}

interface JWTHeader {
    ald: string,
    typ: string
}

interface JWTPayload {
    iat: number,
    exp: number,
    [key: string]: any    
}


const createPayload = (info: Object, lifeTime: number): Object => {
    let payload: Object = {
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + lifeTime
    }

    for (let field in info) {
        payload[field] = info[field];
    }

    return payload;
};


const createSignature = (header: string, payload: string, secret: string): string => {
    return createHmac('sha256', secret)
        .update(header + '.' + payload)
        .digest('base64url')
};


const createJWT = (payload: Object, secret: string, lifeTime: number): string => {  
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const headerHash: string = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadWithTime: Object = createPayload(payload, lifeTime);
    const payloadHash: string = Buffer.from(JSON.stringify(payloadWithTime)).toString('base64url');
    
    const signatureHash = createSignature(headerHash, payloadHash, secret);
    
    return headerHash + '.' + payloadHash + '.' + signatureHash;
}


const decodeJWT = (jwt: string): Object => {
    let decoded: Object = {};
    try {
        const jwtSplitted: Array<string> = jwt.split('.');
        const decodedHeader = Buffer.from(jwt[0], 'base64url').toString('utf8');
        decoded['header'] = JSON.parse(decodedHeader);
        const decodedPayload = Buffer.from(jwt[1], 'base64url').toString('utf8');
        decoded['payload'] = JSON.parse(decodedPayload);
        return decoded;
    } catch {
        return {...decoded, error: true};
    }
}


const isValideJWT = (decoded: JWT, secret: string): boolean => {
    // Если JWT пустой
    if (!decoded ||  Object.keys(decoded).length === 0) {
        return false;
    }
    // Если не передали ключ (в БД нет такого)
    if (!secret || secret === '') {
        return false;
    }
    // Если истекла дата - невалидный
    if ((decoded.payload.exp - 1) < (Date.now() / 1000)) {
        return false;
    }

    const base64Header = Buffer.from(JSON.stringify(decoded.header)).toString('base64url');
    const base64Payload = Buffer.from(JSON.stringify(decoded.payload)).toString('base64url');
    
    return createSignature(base64Header, base64Payload, secret) === decoded[2];
}

export type { 
    JWT, JWTHeader, JWTPayload, 
}; 

export {
    createJWT, decodeJWT, isValideJWT
}
