'use client'
import {Container, Form, Header, Input} from "@/Template/Register/styles";
import {Button, Heading, MultiStep, Text} from "@ignite-ui/react";
import {ArrowRight} from "lucide-react";

export function RegisterTemplate(){
    return(
        <Container>
            <Header>
                <Heading as={'strong'}>
                    Bem-vindo ao Ignite Call!
                </Heading>
                <Text>
                    Precisamos de algumas informações para criar seu perfil!
                    Ah, você pode editar informações depois.
                </Text>

                <MultiStep size={4} currentStep={1}/>
            </Header>

            <Form as={'form'}>
                <label>
                    <Text size={'sm'}>Nome de usuario</Text>
                    <Input prefix={"ignite.com/"} placeholder={"seu-usuario"}/>
                </label>

                <label>
                    <Text size={'sm'}>Nome completo</Text>
                    <Input placeholder={"Seu nome"}/>
                </label>

                <Button>
                    Próximo passo
                    <ArrowRight/>
                </Button>
            </Form>
        </Container>
    )
}