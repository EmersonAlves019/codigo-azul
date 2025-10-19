import { z } from "zod"

export const signupSchema = z.object({
    name: z.string("Nome é obrigatório").min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.email({
        message: "E-mail inválido",
    }),
    password: z.string("Senha é obrigatória").min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string("Confirmação de senha é obrigatória").min(8, "Confirmação de senha deve ter no mínimo 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
})