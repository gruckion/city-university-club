import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "@storybook/test";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "The type of input",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    "aria-invalid": {
      control: "boolean",
      description: "Whether the input is in an invalid state",
    },
  },
  args: {
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
};

export const NumberInput: Story = {
  args: {
    type: "number",
    placeholder: "0",
  },
};

export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Cannot edit",
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    defaultValue: "Disabled value",
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    placeholder: "Invalid input",
    "aria-invalid": true,
  },
};

export const InvalidWithValue: Story = {
  args: {
    defaultValue: "bad@email",
    type: "email",
    "aria-invalid": true,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="input-with-label">Email address</Label>
      <Input {...args} id="input-with-label" />
    </div>
  ),
  args: {
    type: "email",
    placeholder: "email@example.com",
  },
};

export const WithLabelDisabled: Story = {
  render: (args) => (
    <div className="group flex flex-col gap-1.5" data-disabled={args.disabled}>
      <Label htmlFor="disabled-input">Disabled field</Label>
      <Input {...args} id="disabled-input" />
    </div>
  ),
  args: {
    placeholder: "Cannot edit",
    disabled: true,
  },
};

export const WithLabelInvalid: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="invalid-input">Email address</Label>
      <Input {...args} id="invalid-input" />
      <span className="text-destructive text-xs">
        Please enter a valid email address
      </span>
    </div>
  ),
  args: {
    type: "email",
    defaultValue: "invalid-email",
    "aria-invalid": true,
  },
};

export const FullWidth: Story = {
  parameters: {
    layout: "padded",
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <Input {...args} className="w-full" />
    </div>
  ),
  args: {
    placeholder: "Full width input",
  },
};

export const CustomWidth: Story = {
  render: (args) => <Input {...args} className="w-64" />,
  args: {
    placeholder: "Custom 256px width",
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <Input placeholder="Default input" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>With value</Label>
        <Input defaultValue="Input with value" />
      </div>
      <div className="group flex flex-col gap-1.5" data-disabled={true}>
        <Label>Disabled</Label>
        <Input disabled placeholder="Disabled input" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Invalid</Label>
        <Input aria-invalid={true} defaultValue="invalid value" />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Text</Label>
        <Input placeholder="Text input" type="text" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Email</Label>
        <Input placeholder="email@example.com" type="email" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Password</Label>
        <Input placeholder="Password" type="password" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Number</Label>
        <Input placeholder="0" type="number" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Tel</Label>
        <Input placeholder="+1 (555) 000-0000" type="tel" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>URL</Label>
        <Input placeholder="https://example.com" type="url" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Search</Label>
        <Input placeholder="Search..." type="search" />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
