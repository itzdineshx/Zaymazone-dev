import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: January 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                By accessing and using ZAYMAZONE's website and services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p className="text-muted-foreground">
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Permission is granted to temporarily download one copy of the materials on ZAYMAZONE's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We strive to provide accurate product descriptions and images. However, due to the handcrafted nature of our products, slight variations in color, texture, and design may occur.
              </p>
              <p className="text-muted-foreground">
                All products are handmade by skilled artisans and may have minor imperfections that add to their unique character and authenticity.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Pricing and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                All prices are listed in Indian Rupees (INR) and are subject to change without notice. We reserve the right to modify prices at any time.
              </p>
              <p className="text-muted-foreground">
                Payment must be made in full before order processing. We accept major credit cards, debit cards, and digital payment methods.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Shipping and Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We ship to addresses within India and internationally. Shipping costs and delivery times vary by location and are calculated at checkout.
              </p>
              <p className="text-muted-foreground">
                Risk of loss and title for items purchased pass to you upon delivery to the carrier. We are not responsible for lost or stolen packages.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Returns and Refunds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Returns are accepted within 7 days of delivery for items in original condition. Custom or personalized items cannot be returned unless defective.
              </p>
              <p className="text-muted-foreground">
                Refunds will be processed within 5-7 business days of receiving the returned item. Return shipping costs are the responsibility of the customer unless the item is defective.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                All content on this website, including designs, text, graphics, and images, is the property of ZAYMAZONE or our artisan partners and is protected by copyright laws.
              </p>
              <p className="text-muted-foreground">
                Unauthorized use of any content may violate copyright, trademark, and other laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                In no event shall ZAYMAZONE or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ZAYMAZONE's website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Delhi, India.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <div className="text-muted-foreground">
                <p>Email: legal@zaymazone.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: 123 Craft Street, Porur, Chennai 600116</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;