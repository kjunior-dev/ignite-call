'use client'
import {Container, Header } from "@/Template/Register/styles";
import {Button, Heading, MultiStep, Text} from "@ignite-ui/react";
import {AuthError, ConnectBox, ConnectItem} from "@/Template/Connect-Calendar/styles";
import {ArrowRight, Check} from "lucide-react";
import {signIn, useSession} from "next-auth/react";
import {useSearchParams} from "next/navigation";

export function ConnectCalendarTemplate() {

    const session = useSession();
    const searchParams = useSearchParams();

    const hasAuthError = searchParams.get('error') === 'permissions';
    const isSigneIn = session.status === 'authenticated';

    async function handleConnectGoogle(){
        await signIn('google');
    }

    return(
        <Container>
            <Header>
                <Heading as={'strong'}>
                    Conecte sua agenda!
                </Heading>
                <Text>
                    Conecte o seu calendário para verificar automaticamente as horas ocupadas e os novos eventos à medida em que são agendados.
                </Text>

                <MultiStep size={4} currentStep={2}/>
            </Header>

            <ConnectBox>
                <ConnectItem>
                    Google Calendar
                    {
                        isSigneIn ? (
                            <Button size={'sm'} disabled>
                                Conectado
                                <Check/>
                            </Button>
                        ) : (
                            <Button variant={'secondary'} onClick={handleConnectGoogle}>
                                Conectar
                                <ArrowRight/>
                            </Button>
                        )
                    }
                </ConnectItem>

                {hasAuthError && (
                    <AuthError size={'sm'}>
                        Falha ao se conectar ao Google. Verifique se você habilitou as permissões de acesso ao calendário.
                    </AuthError>
                )}

                <Button variant={'primary'} type={'submit'} disabled={!isSigneIn}>
                    Próximo passo
                    <ArrowRight/>
                </Button>
            </ConnectBox>
        </Container>
    )
}