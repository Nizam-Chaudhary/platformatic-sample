const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const nodeAutoInstrumentations = getNodeAutoInstrumentations({
  "@opentelemetry/instrumentation-http": {
    enabled: true,
    propagateTraceContext: true,
  },
});
const FastifyOtelInstrumentation = require("@fastify/otel");
const fastifyOtelInstrumentation = new FastifyOtelInstrumentation({
  registerOnInitialization: true,
  enabled: true,
  servername: "platformatic",
});
const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { OTLPLogExporter } = require("@opentelemetry/exporter-logs-otlp-grpc");
const {
  OTLPMetricExporter,
} = require("@opentelemetry/exporter-metrics-otlp-grpc");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");
const { Resource } = require("@opentelemetry/resources");
const { BatchLogRecordProcessor } = require("@opentelemetry/sdk-logs");
const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} = require("@opentelemetry/semantic-conventions");

const { credentials } = require("@grpc/grpc-js");
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO); //enable for logging otel network calls

// OTLP Trace Exporter (for traces)
const traceExporter = new OTLPTraceExporter({
  url: "localhost:4317", // OTLP gRPC endpoint
  credentials: credentials.createInsecure(),
});

const metricExporter = new OTLPMetricExporter({
  url: "localhost:4317", // OTLP gRPC endpoint
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
  credentials: credentials.createInsecure(),
});

const logProcessor = new BatchLogRecordProcessor(logExporter);

// OpenTelemetry SDK setup
const sdk = new NodeSDK({
  instrumentations: [nodeAutoInstrumentations, fastifyOtelInstrumentation],
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "platformatic",
    [ATTR_SERVICE_VERSION]: "1.0.0",
  }),
  traceExporter: traceExporter,
  metricReader: metricReader,
  logRecordProcessors: [logProcessor],
});

sdk.start();
