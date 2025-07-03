import { Rule } from "../HotkeysController";

export const globalRules: Array<Rule> = [
  {
    condition: { conditionFunction: (target) => target.nodeName === "INPUT" },
    override: [
      {
        hotkey: ["ArrowUp"],
        action: () => {
          console.log("test override action");
          return {
            name: "test override action",
          };
        },
      },
    ],
    disableDefault: true,
  },
];
