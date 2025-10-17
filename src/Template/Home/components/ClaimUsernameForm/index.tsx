'use client'
import {Form, FormAnnotation, Input} from "@/Template/Home/components/ClaimUsernameForm/styles";
import {Button, Text} from "@ignite-ui/react";
import { ArrowRight } from 'lucide-react';
import {useForm} from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {useRouter} from "next/navigation";

const claimUsernameFormSchema = z.object({
    username: z.string().min(3,  "O usuario precisa ter pelo menos 3 caracteres.").regex(/^([a-z\\-]+)$/i,
        {
           message: "O usuario deve conter apenas letras e hifens.",

        }).transform((username) => username.toLowerCase()),
})

export type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm(){

    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClaimUsernameFormData>({
        resolver: zodResolver(claimUsernameFormSchema),
    });

    async function handleClaimUsernameForm(data: ClaimUsernameFormData){
        const { username } = data;

        await router.push(`/register?username=${username}`);
    }

    return(
       <>
           <Form as={'form'} onSubmit={handleSubmit(handleClaimUsernameForm)}>
               <Input
                   size='sm'
                   prefix='ignite.com/'
                   placeholder='seu-usuario'
                   {...register('username')}
               />

               <Button size={'sm'} type={'submit'} disabled={isSubmitting}>
                   Reservar usuario
                   <ArrowRight/>
               </Button>
           </Form>

           <FormAnnotation>
               <Text size={'sm'}>
                   {errors.username
                       ? errors.username.message
                       : 'Digite o nome do seu usuario'
                   }
               </Text>
           </FormAnnotation>
       </>
    )
}