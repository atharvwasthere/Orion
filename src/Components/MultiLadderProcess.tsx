import React, { useState } from "react";
import { MultiStepLoader as Loader } from "../Components/ui/multi-step-loader";
import { useInView } from "framer-motion";

const loadingStates = [
  { text: "Booting up the Orion core" },
  { text: "Syncing contextual memory modules" },
  { text: "Retrieving your company knowledge base" },
  { text: "Mapping user intent to support workflows" },
  { text: "Generating human-like responses" },
  { text: "Evaluating confidence and accuracy" },
  { text: "Escalating complex requests when needed" },
  { text: "Learning from this conversation" },
  { text: "Storing insights for continuous improvement" },
  { text: "Orion systems online" },
];


export function ScrollTriggeredLoader() {
  const [loading, setLoading] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { margin: "-60px", once: false });

  // whenever the section scrolls into view, toggle loading
  React.useEffect(() => {
    if (isInView) setLoading(true);
    else setLoading(false);
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="relative h-[100vh] md:ml-8 w-full text-xl md:text-3xl  flex items-center justify-center bg-inherit"
    >
      {/* Loader lives only inside this section */}
      <Loader
        loadingStates={loadingStates}
        loading={loading}
        duration={1500}
        loop={true}
      />
    </div>
  );
}
