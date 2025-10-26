-- CreateTable
CREATE TABLE "push_subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fcmToken" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "push_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyTasksEnabled" BOOLEAN NOT NULL DEFAULT true,
    "dailyTasksTime" TEXT NOT NULL DEFAULT '09:00',
    "timeZone" TEXT NOT NULL DEFAULT 'UTC',
    "morningEnabled" BOOLEAN NOT NULL DEFAULT false,
    "morningTime" TEXT NOT NULL DEFAULT '07:00',
    "eveningEnabled" BOOLEAN NOT NULL DEFAULT false,
    "eveningTime" TEXT NOT NULL DEFAULT '19:00',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "push_subscription_fcmToken_key" ON "push_subscription"("fcmToken");

-- CreateIndex
CREATE INDEX "push_subscription_userId_idx" ON "push_subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preference_userId_key" ON "notification_preference"("userId");

-- AddForeignKey
ALTER TABLE "push_subscription" ADD CONSTRAINT "push_subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preference" ADD CONSTRAINT "notification_preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
