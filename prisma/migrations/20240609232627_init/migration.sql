-- CreateTable
CREATE TABLE "TwilioMessage" (
    "id" SERIAL NOT NULL,
    "raw" JSONB NOT NULL,
    "messageSid" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwilioMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passcode" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "twilioMessageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Passcode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlackMessage" (
    "id" SERIAL NOT NULL,
    "channel" TEXT NOT NULL,
    "ts" TEXT NOT NULL,
    "passcodeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlackMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Passcode_twilioMessageId_key" ON "Passcode"("twilioMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "SlackMessage_passcodeId_key" ON "SlackMessage"("passcodeId");

-- AddForeignKey
ALTER TABLE "Passcode" ADD CONSTRAINT "Passcode_twilioMessageId_fkey" FOREIGN KEY ("twilioMessageId") REFERENCES "TwilioMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlackMessage" ADD CONSTRAINT "SlackMessage_passcodeId_fkey" FOREIGN KEY ("passcodeId") REFERENCES "Passcode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
