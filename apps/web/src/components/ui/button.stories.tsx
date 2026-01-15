import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "@storybook/test";
import { Button } from "./button";

const CLICK_ME_REGEX = /click me/i;

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
      description: "Button size",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
  },
  args: {
    onClick: fn(),
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default variant
export const Default: Story = {
  args: {
    variant: "default",
  },
};

// Outline variant
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

// Secondary variant
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

// Ghost variant
export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

// Destructive variant
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

// Link variant
export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

// Size variants
export const ExtraSmall: Story = {
  args: {
    size: "xs",
    children: "Extra Small",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};

// With icon (inline start)
export const WithIconStart: Story = {
  args: {
    children: (
      <>
        <svg
          aria-hidden="true"
          data-icon="inline-start"
          fill="none"
          height="16"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        Continue
      </>
    ),
  },
};

// With icon (inline end)
export const WithIconEnd: Story = {
  args: {
    children: (
      <>
        Download
        <svg
          aria-hidden="true"
          data-icon="inline-end"
          fill="none"
          height="16"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      </>
    ),
  },
};

// Icon only buttons
export const IconButton: Story = {
  args: {
    size: "icon",
    children: (
      <svg
        aria-hidden="true"
        fill="none"
        height="16"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    "aria-label": "Add item",
  },
};

export const IconButtonSmall: Story = {
  args: {
    size: "icon-sm",
    children: (
      <svg
        aria-hidden="true"
        fill="none"
        height="14"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
    "aria-label": "Close",
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// Interaction test - Click handler
export const ClickInteraction: Story = {
  args: {
    children: "Click Me",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: CLICK_ME_REGEX });

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

// Interaction test - Disabled button should not fire click
export const DisabledInteraction: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await expect(button).toBeDisabled();
  },
};
