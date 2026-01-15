import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Label text content",
    },
    htmlFor: {
      control: "text",
      description: "ID of the form element the label is for",
    },
  },
  args: {
    children: "Label",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default label",
  },
};

export const WithInput: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label {...args} htmlFor="example-input">
        Email address
      </Label>
      <Input id="example-input" placeholder="email@example.com" type="email" />
    </div>
  ),
};

export const Required: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label {...args} htmlFor="required-input">
        <span>Email address</span>
        <span className="text-destructive">*</span>
      </Label>
      <Input id="required-input" placeholder="email@example.com" type="email" />
    </div>
  ),
};

export const WithHelpText: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label {...args} htmlFor="help-input">
        Username
      </Label>
      <Input id="help-input" placeholder="Enter username" />
      <span className="text-muted-foreground text-xs">
        This will be your public display name
      </span>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="group flex flex-col gap-1.5" data-disabled={true}>
      <Label {...args} htmlFor="disabled-input">
        Disabled field
      </Label>
      <Input disabled id="disabled-input" placeholder="Cannot edit" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <input
        className="h-4 w-4 rounded border-input"
        id="checkbox-example"
        type="checkbox"
      />
      <Label {...args} htmlFor="checkbox-example">
        Accept terms and conditions
      </Label>
    </div>
  ),
};

export const WithRadio: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          className="h-4 w-4 border-input"
          id="radio-1"
          name="radio-group"
          type="radio"
        />
        <Label htmlFor="radio-1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <input
          className="h-4 w-4 border-input"
          id="radio-2"
          name="radio-group"
          type="radio"
        />
        <Label htmlFor="radio-2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <input
          className="h-4 w-4 border-input"
          id="radio-3"
          name="radio-group"
          type="radio"
        />
        <Label htmlFor="radio-3">Option 3</Label>
      </div>
    </div>
  ),
};

export const LongLabel: Story = {
  args: {
    children:
      "This is a very long label text that might wrap to multiple lines depending on the container width",
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <Label {...args}>
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Email address</span>
    </Label>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="default">Default label</Label>
        <Input id="default" placeholder="Default input" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="required">
          <span>Required field</span>
          <span className="text-destructive">*</span>
        </Label>
        <Input id="required" placeholder="Required input" />
      </div>

      <div className="group flex flex-col gap-1.5" data-disabled={true}>
        <Label htmlFor="disabled-variant">Disabled field</Label>
        <Input disabled id="disabled-variant" placeholder="Disabled" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="error">
          <span>Error field</span>
        </Label>
        <Input aria-invalid={true} defaultValue="Invalid" id="error" />
        <span className="text-destructive text-xs">
          This field has an error
        </span>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
