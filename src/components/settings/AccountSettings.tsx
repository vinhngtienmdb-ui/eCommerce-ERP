import React, { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { User, Mail, Phone, Building, Briefcase, Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { auth, storage, db } from "@/src/lib/firebase"
import { updateProfile } from "firebase/auth"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { usePermissions } from "@/src/hooks/usePermissions"
import { toast } from "sonner"

export function AccountSettings() {
  const { t } = useTranslation()
  const { permissions } = usePermissions()
  const user = auth.currentUser
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [localUser, setLocalUser] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    department: "",
    position: "",
    ext: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchExtraInfo = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data()
            setLocalUser({
              displayName: user.displayName || "",
              email: user.email || "",
              phoneNumber: data.phoneNumber || user.phoneNumber || "",
              department: data.department || "",
              position: data.position || "",
              ext: data.ext || ""
            })
          } else {
            setLocalUser({
              displayName: user.displayName || "",
              email: user.email || "",
              phoneNumber: user.phoneNumber || "",
              department: "",
              position: "",
              ext: ""
            })
          }
        } catch (error) {
          console.error("Error fetching extra user info:", error)
        }
      }
    }
    fetchExtraInfo()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    try {
      // Update Auth Profile
      await updateProfile(user, {
        displayName: localUser.displayName
      })

      // Update Firestore for extra fields
      await setDoc(doc(db, 'users', user.uid), {
        displayName: localUser.displayName,
        phoneNumber: localUser.phoneNumber,
        department: localUser.department,
        position: localUser.position,
        ext: localUser.ext,
        updatedAt: new Date().toISOString()
      }, { merge: true })

      toast.success(t("settings.account.saveSuccess") || "Đã cập nhật thông tin tài khoản")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(t("settings.account.saveError") || "Lỗi khi cập nhật thông tin")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      const storageRef = ref(storage, `avatars/${user.uid}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      
      await updateProfile(user, {
        photoURL: downloadURL
      })
      
      // Also update firestore
      await setDoc(doc(db, 'users', user.uid), {
        photoURL: downloadURL
      }, { merge: true })

      toast.success("Đã cập nhật ảnh đại diện")
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast.error("Lỗi khi tải ảnh lên")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t("settings.account.profile")}
          </CardTitle>
          <CardDescription>
            {t("settings.account.profileDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-4">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback className="text-2xl">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold">{user?.displayName || "User"}</h3>
              <p className="text-sm text-muted-foreground">
                {permissions?.role || "User"} • {user?.email}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Button variant="outline" size="sm" onClick={handleAvatarClick} disabled={uploading}>
                  {uploading ? "Đang tải..." : t("settings.account.updateAvatar")}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("settings.account.fullName")}</Label>
              <Input 
                id="fullName" 
                value={localUser.displayName} 
                onChange={(e) => setLocalUser(prev => ({ ...prev, displayName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("settings.account.email")}</Label>
              <Input id="email" type="email" value={localUser.email} disabled className="bg-muted" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mobilePhone">{t("settings.account.mobilePhone")}</Label>
              <Input 
                id="mobilePhone" 
                type="tel" 
                value={localUser.phoneNumber} 
                onChange={(e) => setLocalUser(prev => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ext">{t("settings.account.ext")}</Label>
              <Input 
                id="ext" 
                value={localUser.ext}
                onChange={(e) => setLocalUser(prev => ({ ...prev, ext: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department">{t("settings.account.department")}</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="department" 
                  className="pl-9" 
                  value={localUser.department}
                  onChange={(e) => setLocalUser(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">{t("settings.account.position")}</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="position" 
                  className="pl-9" 
                  value={localUser.position}
                  onChange={(e) => setLocalUser(prev => ({ ...prev, position: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">{t("settings.account.role")}</Label>
            <Input id="role" value={permissions?.role || "User"} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">{t("settings.account.roleDesc")}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>{t("common.cancel")}</Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("settings.general.save")}
        </Button>
      </div>
    </div>
  )
}
