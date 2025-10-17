import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    console.log('📥 [GET] /api/users chamado');

    try {
        const data = await prisma.user.findMany();
        console.log('✅ [GET] Usuários encontrados:', data.length);
        return NextResponse.json(data);
    } catch (err) {
        console.error('❌ [GET] Erro ao buscar usuários:', err);
        return NextResponse.json(
            { error: 'Erro ao buscar usuários', details: String(err) },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    console.log('📥 [POST] /api/users chamado');

    try {
        const body = await req.json();
        console.log('📦 [POST] Body recebido:', body);

        const { name, username } = body;

        if (!name || !username) {
            console.warn('⚠️ [POST] Campos obrigatórios ausentes:', { name, username });
            return NextResponse.json(
                { message: 'Nome e username são obrigatórios' },
                { status: 400 }
            );
        }

        console.log('🔍 [POST] Verificando se username já existe...');
        const userExists = await prisma.user.findUnique({
            where: { username },
        });

        if (userExists) {
            console.warn('⚠️ [POST] Usuário já existe:', username);
            return NextResponse.json(
                { message: 'Usuário já existe' },
                { status: 400 }
            );
        }

        console.log('🛠️ [POST] Criando usuário...');
        const user = await prisma.user.create({
            data: { name, username },
        });
        console.log('✅ [POST] Usuário criado com sucesso:', user);

        const response = NextResponse.json({ message: 'Usuário criado!', user });

        console.log('🍪 [POST] Definindo cookie do usuário...');
        response.cookies.set({
            name: '@ignite-call:userId',
            value: String(user.id),
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });

        console.log('✅ [POST] Cookie definido com sucesso!');
        return response;

    } catch (error) {
        console.error('❌ [POST] Erro inesperado ao criar usuário:', error);
        return NextResponse.json(
            { error: 'Erro ao criar usuário', details: String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    console.log('📥 [DELETE] /api/users chamado');

    try {
        const body = await req.json();
        console.log('📦 [DELETE] Body recebido:', body);

        const { id } = body;

        if (!id) {
            console.warn('⚠️ [DELETE] ID não fornecido');
            return NextResponse.json(
                { message: 'ID é obrigatório para exclusão' },
                { status: 400 }
            );
        }

        console.log('🗑️ [DELETE] Deletando usuário com ID:', id);
        const user = await prisma.user.delete({
            where: { id },
        });

        console.log('✅ [DELETE] Usuário deletado com sucesso:', user);
        return NextResponse.json({ message: 'Usuário deletado!', user });

    } catch (error) {
        console.error('❌ [DELETE] Erro ao deletar usuário:', error);
        return NextResponse.json(
            { error: 'Erro ao deletar usuário', details: String(error) },
            { status: 500 }
        );
    }
}
