import { prisma } from "./prisma"

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE_ARTICLE"
  | "UPDATE_ARTICLE"
  | "DELETE_ARTICLE"
  | "PUBLISH_ARTICLE"
  | "CREATE_USER"
  | "UPDATE_USER"
  | "DELETE_USER"
  | "CREATE_CATEGORY"
  | "UPDATE_CATEGORY"
  | "DELETE_CATEGORY"
  | "CREATE_MENU"
  | "UPDATE_MENU"
  | "DELETE_MENU"
  | "CREATE_PAGE"
  | "UPDATE_PAGE"
  | "DELETE_PAGE"
  | "UPLOAD_FILE"
  | "DELETE_FILE"
  | "UPDATE_SETTINGS"
  | "APPROVE_COMMENT"
  | "REJECT_COMMENT"
  | "DELETE_COMMENT"
  | "CREATE_BANNER"
  | "UPDATE_BANNER"
  | "DELETE_BANNER"
  | "BACKUP_DATABASE"
  | "RESTORE_DATABASE"

interface AuditLogData {
  userId?: string
  action: AuditAction
  resource?: string
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  status: "SUCCESS" | "FAILED"
  errorMessage?: string
}

export async function createAuditLog(data: AuditLogData) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...data,
    }

    console.log("[AUDIT]", JSON.stringify(logEntry))

    // Store in database
    await (prisma as any).auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        status: data.status,
        errorMessage: data.errorMessage,
      },
    })

    return logEntry
  } catch (error) {
    console.error("Failed to create audit log:", error)
  }
}

// Helper to get request metadata
export function getRequestMetadata(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const userAgent = request.headers.get("user-agent")

  const ipAddress = forwarded
    ? forwarded.split(",")[0].trim()
    : realIp || "unknown"

  return {
    ipAddress,
    userAgent: userAgent || "unknown",
  }
}
