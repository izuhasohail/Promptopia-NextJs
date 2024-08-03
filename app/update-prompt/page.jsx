"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "@components/Form";

const EditPromptContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  useEffect(() => {
    const getPromptDetails = async () => {
      if (!promptId) return; // Exit early if no promptId

      try {
        const response = await fetch(`/api/prompt/${promptId}`);

        if (!response.ok) {
          console.error("Failed to fetch prompt details");
          return;
        }

        const data = await response.json();

        setPost({
          prompt: data.prompt || "",
          tag: data.tag || "",
        });
      } catch (error) {
        console.error("Error fetching prompt details:", error);
      }
    };

    getPromptDetails();
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!promptId) {
      alert("Prompt ID not found");
      return;
    }

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to update prompt");
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!promptId) {
    return <div>Error: Prompt ID is missing!</div>;
  }

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

const EditPrompt = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EditPromptContent />
  </Suspense>
);

export default EditPrompt;
