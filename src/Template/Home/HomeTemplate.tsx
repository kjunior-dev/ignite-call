'use client'
import { Heading, Text} from '@ignite-ui/react'
import {Container, Hero, Preview} from "@/Template/Home/styles";
import Image from 'next/image';
import previewImage from '../../assets/calendario.png';
import {ClaimUsernameForm} from "@/Template/Home/components/ClaimUsernameForm";

export default function HomeTemplate() {
    return (
        <Container as='h1'>
            <Hero>
                <Heading as={'h1'} size={'4xl'}>Agendamento descomplicado</Heading>

                <Text size={'lg'}>
                    Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.
                </Text>

                <ClaimUsernameForm/>
            </Hero>

            <Preview>
                <Image
                    src={previewImage}
                    alt={'Canlendario simbolizando aplicação em funcionamento.'}
                    height={400}
                    quality={100}
                    priority
                />
            </Preview>
        </Container>
    );
}
