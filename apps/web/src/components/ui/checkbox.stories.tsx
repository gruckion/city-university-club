import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    "aria-invalid": {
      control: "boolean",
      description: "Whether the checkbox is in an invalid state",
    },
  },
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
  },
};

export const InvalidChecked: Story = {
  args: {
    "aria-invalid": true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} id="checkbox-label" />
      <Label htmlFor="checkbox-label">Accept terms and conditions</Label>
    </div>
  ),
};

export const WithLabelChecked: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} defaultChecked id="checkbox-label-checked" />
      <Label htmlFor="checkbox-label-checked">I agree to the policy</Label>
    </div>
  ),
};

export const WithLabelDisabled: Story = {
  render: (args) => (
    <div className="group/field flex items-center gap-2">
      <Checkbox {...args} disabled id="checkbox-disabled" />
      <Label className="opacity-50" htmlFor="checkbox-disabled">
        Disabled option
      </Label>
    </div>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <div className="flex items-start gap-2">
      <Checkbox {...args} className="mt-0.5" id="checkbox-description" />
      <div className="flex flex-col gap-1">
        <Label htmlFor="checkbox-description">Marketing emails</Label>
        <span className="text-muted-foreground text-xs">
          Receive emails about new products and features
        </span>
      </div>
    </div>
  ),
};

export const Required: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} id="checkbox-required" required />
      <Label htmlFor="checkbox-required">
        <span>I accept the terms</span>
        <span className="text-destructive">*</span>
      </Label>
    </div>
  ),
};

export const Controlled: Story = {
  render(args) {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            {...args}
            checked={checked}
            id="controlled"
            onCheckedChange={setChecked}
          />
          <Label htmlFor="controlled">
            {checked ? "Checked" : "Unchecked"}
          </Label>
        </div>
        <p className="text-muted-foreground text-xs">
          State: {checked ? "true" : "false"}
        </p>
      </div>
    );
  },
};

export const CheckboxGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-sm">Select your interests:</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox id="tech" />
          <Label htmlFor="tech">Technology</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox defaultChecked id="design" />
          <Label htmlFor="design">Design</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="business" />
          <Label htmlFor="business">Business</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox disabled id="science" />
          <Label className="opacity-50" htmlFor="science">
            Science (unavailable)
          </Label>
        </div>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="flex w-[300px] flex-col gap-4 rounded border p-4">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">Notification Preferences</p>
        <p className="text-muted-foreground text-xs">
          Choose what notifications you receive
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <Checkbox className="mt-0.5" defaultChecked id="email-notif" />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="email-notif">Email notifications</Label>
            <span className="text-muted-foreground text-xs">
              Get notified via email
            </span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox className="mt-0.5" id="push-notif" />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="push-notif">Push notifications</Label>
            <span className="text-muted-foreground text-xs">
              Get notified on your device
            </span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox className="mt-0.5" disabled id="sms-notif" />
          <div className="flex flex-col gap-0.5 opacity-50">
            <Label htmlFor="sms-notif">SMS notifications</Label>
            <span className="text-muted-foreground text-xs">Coming soon</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox id="default-state" />
          <Label htmlFor="default-state">Default</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox defaultChecked id="checked-state" />
          <Label htmlFor="checked-state">Checked</Label>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox disabled id="disabled-state" />
          <Label className="opacity-50" htmlFor="disabled-state">
            Disabled
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox defaultChecked disabled id="disabled-checked-state" />
          <Label className="opacity-50" htmlFor="disabled-checked-state">
            Disabled checked
          </Label>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox aria-invalid={true} id="invalid-state" />
          <Label htmlFor="invalid-state">Invalid</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            aria-invalid={true}
            defaultChecked
            id="invalid-checked-state"
          />
          <Label htmlFor="invalid-checked-state">Invalid checked</Label>
        </div>
      </div>
    </div>
  ),
};

export const InteractionTest: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} id="interactive-checkbox" />
      <Label htmlFor="interactive-checkbox">Click to toggle</Label>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    // Initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Click to check
    await userEvent.click(checkbox);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);

    // Click to uncheck
    await userEvent.click(checkbox);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(false);
  },
};
