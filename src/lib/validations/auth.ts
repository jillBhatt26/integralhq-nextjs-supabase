import { z } from 'zod';

const signupUserSchema = z
    .object({
        username: z
            .string()
            .trim()
            .min(3, 'Username should be more than 3 characters long')
            .max(255, 'Username should be less than 255 characters long'),
        email: z.email('Email should be valid!').trim(),
        password: z
            .string()
            .trim()
            .min(8, 'Password must be at least 8 characters long')
            .regex(
                /[A-Z]/,
                'Password must contain at least one uppercase letter'
            )
            .regex(
                /[a-z]/,
                'Password must contain at least one lowercase letter'
            )
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(
                /[!@#$%^&*]/,
                'Password must contain at least one special character (!@#$%^&*)'
            ),
        confirmPassword: z.string().trim()
    })
    .refine(
        signupUserInputs =>
            signupUserInputs.password === signupUserInputs.confirmPassword,
        {
            error: 'Confirm password should be same as password',
            path: ['confirmPassword']
        }
    );

const loginUserSchema = z.object({
    email: z.email('Email should be valid!').trim(),
    password: z
        .string('Password must be a string')
        .trim()
        .min(8, 'Password must be more than 8 characters long')
        .max(255, 'Password must be more than 255 characters long')
});

export { signupUserSchema, loginUserSchema };
