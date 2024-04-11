import { AwsClient } from "aws4fetch";

const MODEL_MAPPING = {
  "claude-3-sonnet-20240229": "anthropic.claude-3-sonnet-20240229-v1:0",
  "claude-3-haiku-20240307": "anthropic.claude-3-haiku-20240307-v1:0",
};

const REGION = "us-east-1";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

const explainAuthKey = (authKey) => {
  const accessKeyId = authKey.match(/accessKeyId=([^;]*)/)?.[1] || null;
  const secretAccessKey = authKey.match(/secretAccessKey=([^;]*)/)?.[1] || null;
  return { accessKeyId, secretAccessKey };
};

const handleRequest = async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  let body;
  if (request.method === "POST") body = await request.json();
  const { max_tokens, messages, model } = body || {};

  const deployName = MODEL_MAPPING[model] || "";
  if (deployName === "") return new Response("Missing model mapper", { status: 403 });

  const { accessKeyId, secretAccessKey } = explainAuthKey(request.headers.get("X-Api-Key"));
  if (!accessKeyId || !secretAccessKey) return new Response("Not allowed", { status: 403 });

  const aws = new AwsClient({ accessKeyId, secretAccessKey, service: "bedrock" });
  const fetchAPI = `https://bedrock-runtime.${REGION}.amazonaws.com/model/${deployName}/invoke`;

  const requestPayload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens,
    messages,
    stop_sequences: ["\n\nHuman:"],
    temperature: 1,
    top_k: 250,
    top_p: 0.999,
  };

  let response = await aws.fetch(fetchAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestPayload),
  });

  response = new Response(response.body, response);
  response.headers.set("Access-Control-Allow-Origin", "*");

  return response;
};
