import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "@storybook/test";
import { ThemeProvider } from "next-themes";
import SignInForm from "./sign-in-form";
import { Toaster } from "./ui/sonner";

const EMAIL_REGEX = /email/i;
const PASSWORD_REGEX = /password/i;
const NEED_ACCOUNT_REGEX = /need an account/i;

const ThemeDecorator = (Story: React.ComponentType) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    disableTransitionOnChange
  >
    <Story />
    <Toaster />
  </ThemeProvider>
);

const meta = {
  title: "Components/SignInForm",
  component: SignInForm,
  decorators: [ThemeDecorator],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/auth",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onSwitchToSignUp: fn(),
  },
} satisfies Meta<typeof SignInForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContainer: Story = {
  render: (args) => (
    <div className="w-[400px] rounded-lg border shadow-sm">
      <SignInForm {...args} />
    </div>
  ),
};

export const InCard: Story = {
  render: (args) => (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-card shadow-lg">
        <SignInForm {...args} />
      </div>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};

export const FilledForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByLabelText(EMAIL_REGEX);
    const passwordInput = canvas.getByLabelText(PASSWORD_REGEX);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    await expect(emailInput).toHaveValue("test@example.com");
    await expect(passwordInput).toHaveValue("password123");
  },
};

export const SwitchToSignUp: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const switchButton = canvas.getByRole("button", {
      name: NEED_ACCOUNT_REGEX,
    });
    await userEvent.click(switchButton);

    await expect(args.onSwitchToSignUp).toHaveBeenCalled();
  },
};
