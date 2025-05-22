import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageSquare, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | SuiStream",
  description: "Get in touch with the SuiStream team for support, feedback, or business inquiries",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-xl text-muted-foreground mt-4">Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Mail className="h-8 w-8" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">support@suistream.com</p>
            <p className="text-muted-foreground">business@suistream.com</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <MessageSquare className="h-8 w-8" />
              Live Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Available 24/7 through our in-app chat support</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline">Start Chat</Button>
          </CardFooter>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Phone className="h-8 w-8" />
              Phone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
            <p className="text-sm text-muted-foreground">Mon-Fri: 9am-5pm EST</p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="business">Business Opportunity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help you?" rows={5} />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">How quickly will I receive a response?</h3>
            <p className="text-sm text-muted-foreground">
              We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please use
              our live chat for immediate assistance.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">I'm having technical issues. What should I do?</h3>
            <p className="text-sm text-muted-foreground">
              For technical support, please visit our Help Center first to see if your issue has a documented solution.
              If not, contact us with specific details about the problem you're experiencing.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">How do I report content issues?</h3>
            <p className="text-sm text-muted-foreground">
              If you encounter inappropriate content or copyright concerns, please use the "Report" button on the
              content page or contact us directly with details about the issue.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">I'm interested in partnering with SuiStream</h3>
            <p className="text-sm text-muted-foreground">
              For business partnerships, content licensing, or integration opportunities, please email
              business@suistream.com with your proposal and company information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
