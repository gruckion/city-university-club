import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "@storybook/test";
import { ThemeProvider } from "next-themes";
import SignUpForm from "./sign-up-form";
import { Toaster } from "./ui/sonner";

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
  title: "Components/SignUpForm",
  component: SignUpForm,
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
    onSwitchToSignIn: fn(),
  },
} satisfies Meta<typeof SignUpForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContainer: Story = {
  render: (args) => (
    <div className="w-[400px] rounded-lg border shadow-sm">
      <SignUpForm {...args} />
    </div>
  ),
};

export const InCard: Story = {
  render: (args) => (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-card shadow-lg">
        <SignUpForm {...args} />
      </div>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};

export const SideBySide: Story = {
  render: (args) => (
    <div className="flex gap-8 p-4">
      <div className="w-[400px] rounded-lg border shadow-sm">
        <SignUpForm {...args} />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
