import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeProvider } from "next-themes";
import { toast } from "sonner";
import { Button } from "./button";
import { Toaster } from "./sonner";

// Decorator to provide theme context
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
  title: "UI/Toaster",
  component: Toaster,
  decorators: [ThemeDecorator],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Button onClick={() => toast("Default toast message")}>Show Toast</Button>
  ),
};

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success("Action completed successfully!")}>
      Show Success Toast
    </Button>
  ),
};

export const ErrorToast: Story = {
  render: () => (
    <Button
      onClick={() => toast.error("Something went wrong!")}
      variant="destructive"
    >
      Show Error Toast
    </Button>
  ),
};

export const Warning: Story = {
  render: () => (
    <Button
      onClick={() => toast.warning("Please check your input")}
      variant="outline"
    >
      Show Warning Toast
    </Button>
  ),
};

export const Info: Story = {
  render: () => (
    <Button
      onClick={() => toast.info("Here is some information")}
      variant="secondary"
    >
      Show Info Toast
    </Button>
  ),
};

export const Loading: Story = {
  render: () => (
    <Button
      onClick={() => {
        const toastId = toast.loading("Loading data...");
        setTimeout(() => {
          toast.success("Data loaded!", { id: toastId });
        }, 2000);
      }}
    >
      Show Loading Toast
    </Button>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("File uploaded", {
          description: "Your file has been uploaded successfully.",
        })
      }
    >
      Toast with Description
    </Button>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("Message sent", {
          action: {
            label: "Undo",
            onClick: () => toast.info("Action undone"),
          },
        })
      }
    >
      Toast with Action
    </Button>
  ),
};

export const WithCancel: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("Delete item?", {
          action: {
            label: "Delete",
            onClick: () => toast.success("Item deleted"),
          },
          cancel: {
            label: "Cancel",
            onClick: () => toast.info("Cancelled"),
          },
        })
      }
    >
      Toast with Cancel
    </Button>
  ),
};

export const PromiseToast: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.promise(
          new window.Promise<void>((resolve) => setTimeout(resolve, 2000)),
          {
            loading: "Saving changes...",
            success: "Changes saved!",
            error: "Failed to save changes",
          }
        )
      }
    >
      Promise Toast
    </Button>
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button
        onClick={() => toast("Quick toast", { duration: 1000 })}
        variant="outline"
      >
        1 second
      </Button>
      <Button
        onClick={() => toast("Normal toast", { duration: 3000 })}
        variant="outline"
      >
        3 seconds
      </Button>
      <Button
        onClick={() => toast("Long toast", { duration: 10_000 })}
        variant="outline"
      >
        10 seconds
      </Button>
    </div>
  ),
};

export const Dismissible: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("This can be dismissed by clicking", {
          duration: Number.POSITIVE_INFINITY,
        })
      }
    >
      Persistent Toast
    </Button>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Button onClick={() => toast("Default message")} variant="outline">
        Default
      </Button>
      <Button
        onClick={() => toast.success("Success message")}
        variant="outline"
      >
        Success
      </Button>
      <Button onClick={() => toast.error("Error message")} variant="outline">
        Error
      </Button>
      <Button
        onClick={() => toast.warning("Warning message")}
        variant="outline"
      >
        Warning
      </Button>
      <Button onClick={() => toast.info("Info message")} variant="outline">
        Info
      </Button>
      <Button
        onClick={() => {
          const id = toast.loading("Loading...");
          setTimeout(() => toast.dismiss(id), 2000);
        }}
        variant="outline"
      >
        Loading
      </Button>
    </div>
  ),
};

export const RichContent: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast(
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
              JD
            </span>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-muted-foreground text-xs">
                Sent you a message
              </p>
            </div>
          </div>
        )
      }
    >
      Rich Content Toast
    </Button>
  ),
};

export const DismissAll: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          toast("Toast 1");
          toast("Toast 2");
          toast("Toast 3");
        }}
        variant="outline"
      >
        Show Multiple
      </Button>
      <Button onClick={() => toast.dismiss()} variant="destructive">
        Dismiss All
      </Button>
    </div>
  ),
};
