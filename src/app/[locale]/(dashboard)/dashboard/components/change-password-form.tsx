"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { changePassword } from '@/actions/auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const formSchema = z.object({
  currentPassword: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})

export function ChangePasswordForm({ userId }: { userId: number }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await changePassword(
        userId,
        values.currentPassword,
        values.newPassword
      )
      
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Mot de passe changé avec succès')
        form.reset()
        router.refresh()
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe actuel</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Entrez votre mot de passe actuel" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Entrez votre nouveau mot de passe" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmez le nouveau mot de passe</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirmez votre nouveau mot de passe" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-2">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "En cours..." : "Changer le mot de passe"}
          </Button>
        </div>
      </form>
    </Form>
  )
}