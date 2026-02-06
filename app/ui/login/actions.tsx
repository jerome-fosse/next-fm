'use server';

import {redirect} from "next/navigation";

export async function SignIn(formData: FormData) {
    console.log(formData);
    redirect('/home')
}