import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { IconMail, IconMessage2, IconPhone, IconUser, IconLoader2 } from "@tabler/icons-react"

interface ContactInfoFormProps {
    formData: {
        name: string
        contact: string
        email: string
        message: string
    }
    isOrderMode: boolean
    submitting: boolean
    onSubmit: (e: React.FormEvent) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function ContactInfoForm({
    formData,
    isOrderMode,
    submitting,
    onSubmit,
    onChange
}: ContactInfoFormProps) {
    return (
        <Card className={isOrderMode ? "sticky top-20" : ""}>
            <CardContent className="p-6">
                {isOrderMode && <h2 className="text-2xl font-bold mb-6">Contact Information</h2>}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                            <IconUser className="w-4 h-4" />
                            <h6>Full Name *</h6>
                        </label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={onChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="contact" className="text-sm font-semibold flex items-center gap-2">
                            <IconPhone className="w-4 h-4" />
                            <h6>Phone or Telegram *</h6>
                        </label>
                        <Input
                            id="contact"
                            name="contact"
                            placeholder="+1234567890 or @username"
                            required
                            value={formData.contact}
                            onChange={onChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                            <IconMail className="w-4 h-4" />
                            <h6>Email (Optional)</h6>
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={onChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-semibold flex items-center gap-2">
                            <IconMessage2 className="w-4 h-4" />
                            <h6>Message {isOrderMode ? "(Optional)" : "*"}</h6>
                        </label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder={isOrderMode ? "Any special requests or delivery notes..." : "How can we help you?"}
                            rows={isOrderMode ? 4 : 6}
                            required={!isOrderMode}
                            value={formData.message}
                            onChange={onChange}
                        />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                        {submitting ? (
                            <>
                                <IconLoader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                                {isOrderMode ? "Sending Order..." : "Sending..."}
                            </>
                        ) : (
                            isOrderMode ? "Place Order" : "Send Message"
                        )}
                    </Button>

                    {isOrderMode && (
                        <p className="text-xs text-muted-foreground text-center">
                            * Required fields. We'll contact you to confirm your order and arrange delivery.
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}