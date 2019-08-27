import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Layout } from "./layout";
import { machine } from "./machine";
import "./App.css";

const App = () => {
  const [current, send] = useMachine(machine, { devTools: true });

  useEffect(() => {
    const sendScrollEvent = () => {
      send("scroll");
    };

    window.addEventListener("scroll", sendScrollEvent);

    return () => {
      window.removeEventListener("scroll", sendScrollEvent);
    };
  }, [send]);

  return (
    <Layout>
      {current.context.allStories
        .filter(s => typeof s === "object")
        .map(s => (
          <div style={{ padding: 10 }} key={s.id}>
            {s.title}
          </div>
        ))}
    </Layout>
  );
};

export default App;
