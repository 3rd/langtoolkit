import { Playground } from "@/components/Playground";

const roles = ["system", "assistant", "user"];

export const PlaygroundPage = () => {
  return <Playground roles={roles} />;
};
