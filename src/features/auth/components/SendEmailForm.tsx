import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { emailLinkSchema, EmailLinkSchema } from "../schemas/sendEmailLink.schema";

const SendEmailForm = () => {
  const { mutate, isLoading } = useForgotPassword();
  const form = useForm<EmailLinkSchema>({
    resolver: zodResolver(emailLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleLogin = (values: EmailLinkSchema) => {
    mutate(values.email);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            <Link to="/login" className="text-primary">
             Back to Login
            </Link>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full" >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SendEmailForm;
