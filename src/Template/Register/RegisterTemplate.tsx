'use client'
import {Container, Form, FormErro, Header, Input} from "@/Template/Register/styles";
import {Button, Heading, MultiStep, Text} from "@ignite-ui/react";
import {ArrowRight} from "lucide-react";
import {useForm} from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import {useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {api} from "@/lib/axios";
import {toast} from "react-toastify";
import {AxiosError} from "axios";

// 1º
const registerFormSchema = z.object({
    username: z.string().min(3,  "O usuario precisa ter pelo menos 3 caracteres.").regex(/^([a-z\\-]+)$/i,
        {
            message: "O usuario deve conter apenas letras e hifens.",

        }).transform((username) => username.toLowerCase()),

    name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres."),
})

// 2º
export type RegisterFormData = z.infer<typeof registerFormSchema>

export function RegisterTemplate(){
                                                                        // 3º
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
    });

    const router = useRouter();

    async function handleRegister(data: RegisterFormData){
        try {
            await api.post('/users', {
                name: data.name,
                username: data.username,
            });

            toast.success("Usuario criado com sucesso!")

            await router.push('/register/connect-calendar')
        }catch (err) {
           if (err instanceof AxiosError && err?.response?.data?.message){
               toast.error(`${err?.response?.data?.message}`);
               return;
           }
            console.log("========================");
            console.log({Error: err});
            console.log("========================");
        }
    }

    // Pegando valor na url
    const searchParams = useSearchParams();

    // Acessando valor da url
    const username = searchParams.get('username');

    useEffect(() => {
        if (username){
            setValue('username', String(username))
        }
    }, [username, setValue]);

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

            <Form as={'form'} onSubmit={handleSubmit(handleRegister)} >
                <label>
                    <Text size={'sm'}>Nome de usuario</Text>
                    <Input
                        {...register("username")}
                        prefix={"ignite.com/"}
                        placeholder={"seu-usuario"}
                    />
                    {errors.username && (
                        <FormErro size={'sm'}>{errors.username.message}</FormErro>
                    )}
                </label>

                <label>
                    <Text size={'sm'}>Nome completo</Text>
                    <Input
                        {...register("name")}
                        placeholder={"Seu nome"}
                    />
                    {errors.name && (
                        <FormErro size={'sm'}>{errors.name.message}</FormErro>
                    )}
                </label>

                <Button disabled={isSubmitting}>
                    Próximo passo <ArrowRight/>
                </Button>
            </Form>
        </Container>
    )
}