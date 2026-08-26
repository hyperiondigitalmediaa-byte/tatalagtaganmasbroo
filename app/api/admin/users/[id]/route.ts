import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    // Only ADMIN can delete users
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: userId } = await params

    // Cannot delete yourself
    if (userId === (session.user as any)?.id) {
      return NextResponse.json(
        { error: "Tidak bisa menghapus akun sendiri" },
        { status: 400 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: "User berhasil dihapus" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Gagal menghapus user" },
      { status: 500 }
    )
  }
}
