import FastifyOtelInstrumentation from "@fastify/otel";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

import { credentials } from "@grpc/grpc-js";
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO); //enable for logging otel network calls

// OTLP Trace Exporter (for traces)
const traceExporter = new OTLPTraceExporter({
  url: "localhost:4317", // OTLP gRPC endpoint
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  credentials: credentials.createInsecure(),
});

const metricExporter = new OTLPMetricExporter({
  url: "localhost:4317", // OTLP gRPC endpoint
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  credentials: credentials.createInsecure(),
});

// OTLP Metric Exporter (for metrics)
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 5000, // Export every 5 seconds
});

// OTLP Log exporter (for logs)
const logExporter = new OTLPLogExporter({
  url: "localhost:4317",
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  credentials: credentials.createInsecure(),
});

const logProcessor = new BatchLogRecordProcessor(logExporter);

// const meterProvider = new MeterProvider({
//   resource: new Resource({
//     [ATTR_SERVICE_NAME]: 'platformatic',
//     [ATTR_SERVICE_VERSION]: '1.0.0',
//   }),
//   readers: [
//     new PeriodicExportingMetricReader({
//       exporter: metricExporter,
//       exportIntervalMillis: 5000,
//     }),
//   ],
// });

export const fastifyOtelInstrumentation = new FastifyOtelInstrumentation({
  registerOnInitialization: true,
  enabled: true,
  servername: "platformatic",
});

// Get the auto-instrumentations with the same config as in the preload file

// fastifyOtelInstrumentation.setMeterProvider(meterProvider);

// OpenTelemetry SDK setup
const sdk = new NodeSDK({
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-http": {
        enabled: true,
        propagateTraceContext: true,
      },
      "@opentelemetry/instrumentation-fastify": {
        enabled: true,
        requestHook: (span, request, response) => {
          span.setAttribute("request.method", request.method);
          span.setAttribute("request.url", request.url);
          span.setAttribute("response.status_code", response.statusCode);
        },
      },
    }),
    // fastifyOtelInstrumentation,
  ],
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "platformatic",
    [ATTR_SERVICE_VERSION]: "1.0.0",
  }),
  traceExporter: traceExporter,
  metricReader: metricReader,
  logRecordProcessors: [logProcessor],
});

sdk.start();

export default sdk;
