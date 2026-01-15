import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Loader from "./loader";

const meta = {
  title: "Components/Loader",
  component: Loader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InContainer: Story = {
  render: () => (
    <div className="h-64 w-64 rounded border">
      <Loader />
    </div>
  ),
};

export const FullPage: Story = {
  render: () => (
    <div className="h-screen w-screen">
      <Loader />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};
