'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PoliciesPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">AVLANC Policies</h1>
      
      <ScrollArea className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-4">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Terms & Conditions */}
              <div>
                <p className="text-lg font-semibold mb-4">Welcome to AVLANC</p>
                <p className="text-muted-foreground">
                  Welcome to AVLANC, a digital development studio located in Indore, Madhya Pradesh. By accessing our website https://www.avlanc.com or engaging in our services, you agree to the following Terms and Conditions. These terms serve as a binding agreement between AVLANC and the user (client/customer).
                </p>
              </div>

              {/* Scope of Services */}
              <div>
                <p className="text-lg font-semibold mb-4">Scope of Services</p>
                <p className="text-muted-foreground">
                  AVLANC deals strictly in website and mobile application development. We do not provide hosting services, domain registration, email server setup, or server maintenance. Clients are responsible for acquiring and maintaining their hosting infrastructure.
                </p>
              </div>

              {/* Project Initiation */}
              <div>
                <p className="text-lg font-semibold mb-4">Project Initiation</p>
                <ul className="list-disc pl-5 text-muted-foreground">
                  <li>A project is initiated only after the client approves the proposal/quotation and makes a minimum 50% advance payment.</li>
                  <li>The remaining balance is payable upon project completion and before final handover.</li>
                </ul>
              </div>

              {/* Quotations & Pricing */}
              <div>
                <p className="text-lg font-semibold mb-4">Quotations & Pricing</p>
                <ul className="list-disc pl-5 text-muted-foreground">
                  <li>All quotations are valid for 15 days from the date of issue.</li>
                  <li>Pricing may vary if the project scope changes or additional features are requested after the initial agreement.</li>
                  <li>Any third-party charges (plugins, APIs, stock images, etc.) will be billed separately with prior approval.</li>
                </ul>
              </div>

              {/* Client Responsibilities */}
              <div>
                <p className="text-lg font-semibold mb-4">Client Responsibilities</p>
                <p className="text-muted-foreground">
                  Clients must provide all necessary content (text, images, videos, etc.) and inputs required for development.
                </p>
                <p className="text-muted-foreground">
                  Delays in providing materials or approvals may affect the timeline and are not the responsibility of AVLANC.
                </p>
              </div>

              {/* Ownership & Usage Rights */}
              <div>
                <p className="text-lg font-semibold mb-4">Ownership & Usage Rights</p>
                <p className="text-muted-foreground">
                  Upon full payment, the client holds the ownership of the source code, designs, and digital assets developed under the agreed scope.
                </p>
                <p className="text-muted-foreground">
                  AVLANC retains the right to display completed projects in its portfolio and marketing materials unless specifically requested not to.
                </p>
              </div>

              {/* Privacy Policy */}
              <div>
                <p className="text-2xl font-bold mb-4">Privacy Policy</p>
                <p className="text-muted-foreground">
                  At AVLANC, we take your privacy seriously. This Privacy Policy outlines how we handle your data and what measures we take to keep your information safe and secure.
                </p>

                <div className="space-y-4">
                  {/* Data Collection */}
                  <div>
                    <p className="text-lg font-semibold mb-2">Data Collection</p>
                    <p className="text-muted-foreground">
                      When you use our website or contact us, we may collect:
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Name, email address, phone number, company details</li>
                      <li>Project-specific details and feedback</li>
                      <li>Technical details like browser type, IP address, and device usage (for analytics)</li>
                    </ul>
                  </div>

                  {/* Use of Information */}
                  <div>
                    <p className="text-lg font-semibold mb-2">Use of Information</p>
                    <p className="text-muted-foreground">
                      Your data may be used for:
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Communication and project updates</li>
                      <li>Sending invoices, contracts, or official communication</li>
                      <li>Website analytics and user experience improvement</li>
                    </ul>
                  </div>

                  {/* Data Protection */}
                  <div>
                    <p className="text-lg font-semibold mb-2">Data Protection</p>
                    <p className="text-muted-foreground">
                      We use SSL encryption and trusted third-party platforms for data storage and communication.
                    </p>
                    <p className="text-muted-foreground">
                      Your personal information is not sold, rented, or disclosed to unauthorized third parties.
                    </p>
                    <p className="text-muted-foreground">
                      We may share relevant project data with our internal team or subcontractors bound by confidentiality.
                    </p>
                  </div>

                  {/* Cookies & Tracking */}
                  <div>
                    <p className="text-lg font-semibold mb-2">Cookies & Tracking</p>
                    <p className="text-muted-foreground">
                      Our website may use cookies or similar tracking tools to analyze traffic and enhance user experience. You can control cookie permissions via your browser settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Refund Policy */}
              <div>
                <p className="text-2xl font-bold mb-4">Refund Policy</p>
                <p className="text-muted-foreground">
                  At AVLANC, we believe in transparency and integrity in all financial transactions. However, due to the nature of our services (custom digital development), we have a clear refund policy.
                </p>

                <div className="space-y-4">
                  {/* When Are Refunds Applicable */}
                  <div>
                    <p className="text-lg font-semibold mb-2">When Are Refunds Applicable?</p>
                    <p className="text-muted-foreground">
                      Refunds are only considered if the client cancels the project before development begins, and work has not yet started.
                    </p>
                    <p className="text-muted-foreground">
                      If a refund is approved, up to 80% of the paid amount may be refunded, after deducting administrative and planning costs.
                    </p>
                    <p className="text-muted-foreground">
                      Once development work has begun, no refund will be provided under any circumstance.
                    </p>
                  </div>

                  {/* No Refund Scenarios */}
                  <div>
                    <p className="text-lg font-semibold mb-2">No Refund Scenarios</p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Project delay due to client-side unresponsiveness or content delay</li>
                      <li>Change of mind after project initiation</li>
                      <li>Scope changes mid-development without additional charges</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Website & Application Delivery Policy */}
              <div>
                <p className="text-2xl font-bold mb-4">Website & Application Delivery Policy</p>
                <p className="text-muted-foreground">
                  We are committed to delivering high-quality websites and applications on time and as per the agreed scope.
                </p>

                <div className="space-y-4">
                  {/* Delivery Timeframes */}
                  <div>
                    <p className="text-lg font-semibold mb-2">Delivery Timeframes</p>
                    <p className="text-muted-foreground">
                      Our estimated project timelines are:
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Static Websites: 7–10 business days</li>
                      <li>Dynamic Websites / CMS (e.g., WordPress): 15–20 business days</li>
                      <li>Custom Web Applications: 30–60 business days</li>
                      <li>Mobile Applications (Android/iOS): 40–75 business days</li>
                    </ul>
                    <p className="text-muted-foreground">
                      Timelines begin only after the project is confirmed, the advance payment is received, and all required materials are submitted by the client.
                    </p>
                  </div>

                  {/* Delivery Format */}
                  <div>
                    <p className="text-lg font-semibold mb-2">Delivery Format</p>
                    <p className="text-muted-foreground">
                      Projects are delivered via:
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Live demo on staging servers</li>
                      <li>Final handover via ZIP files or repository (GitHub, Google Drive, or other agreed method)</li>
                      <li>Source code (for applicable plans)</li>
                    </ul>
                  </div>

                  {/* Support After Delivery */}
                  <div>
                    <p className="text-lg font-semibold mb-2">Support After Delivery</p>
                    <p className="text-muted-foreground">
                      We offer 7 days of post-delivery support for minor bug fixes or content updates.
                    </p>
                    <p className="text-muted-foreground">
                      Long-term maintenance or feature enhancements can be contracted separately.
                    </p>
                  </div>

                  {/* Delay Disclaimer */}
                  <div>
                    <p className="text-lg font-semibold mb-2">Delay Disclaimer</p>
                    <p className="text-muted-foreground">
                      Delays due to:
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Incomplete client input</li>
                      <li>Third-party tools or service disruptions</li>
                      <li>Scope creep or last-minute changes</li>
                    </ul>
                    <p className="text-muted-foreground">
                      ...are not counted against AVLANC's timeline responsibility.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <p className="text-lg font-semibold mb-4">Contact Information</p>
                <p className="text-muted-foreground">
                  Business Address: Patel Nagar, Opp. BPCPS, Holkar Airport, Indore, Madhya Pradesh
                </p>
                <p className="text-muted-foreground">
                  Email: support@avlanc.com
                </p>
                <p className="text-muted-foreground">
                  Phone: +91 93026 87277
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
