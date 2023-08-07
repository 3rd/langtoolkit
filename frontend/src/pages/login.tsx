import { useAuth } from "@/providers/AuthProvider";
import { Button, Paper, TextInput, Text, Stack, PasswordInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});

export const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<z.infer<typeof schema>>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(schema),
  });

  const handleLogin = async (values: z.infer<typeof schema>) => {
    const data = schema.parse(values);
    try {
      await login(data.email, data.password);
    } catch (error) {
      // TODO: handle error
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) return;
    const origin = location.state?.from?.pathname || "/dashboard";
    navigate(origin);
  }, [location.state?.from?.pathname, navigate, user]);

  return (
    <Paper maw="50%" mt="xl" mx="auto" p="xl" radius="md" withBorder>
      <Text align="center" size="lg" weight={500}>
        Login
      </Text>

      <form onSubmit={form.onSubmit(handleLogin)}>
        <Stack>
          <TextInput
            error={form.errors.email}
            label="Email"
            name="lt-email"
            placeholder="hello@mantine.dev"
            radius="md"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            error={form.errors.password}
            label="Password"
            name="lt-pass"
            placeholder="Your password"
            radius="md"
            {...form.getInputProps("password")}
          />
        </Stack>

        <Stack align="center" mt="xl">
          <Button radius="xl" type="submit">
            Login
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};
