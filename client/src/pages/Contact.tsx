import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // You can add form submission logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#fcd34d] mb-4">
            CONTACT TUSKERS CC
          </h1>
          <p className="text-lg text-[#bfdbfe] max-w-2xl mx-auto">
            Get in touch with us for any inquiries, membership information, or to join our cricket community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-[#fcd34d]/20">
              <CardHeader>
                <CardTitle className="text-[#fcd34d] text-xl">Get In Touch</CardTitle>
                <CardDescription className="text-[#bfdbfe]">
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-[#bfdbfe]">
                  <Mail className="h-5 w-5 text-[#fcd34d]" />
                  <span>info@tuskerscc.com</span>
                </div>
                <div className="flex items-center space-x-3 text-[#bfdbfe]">
                  <Phone className="h-5 w-5 text-[#fcd34d]" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-[#bfdbfe]">
                  <MapPin className="h-5 w-5 text-[#fcd34d]" />
                  <span>Cricket Ground, Sports Complex<br />City, State 12345</span>
                </div>
                <div className="flex items-center space-x-3 text-[#bfdbfe]">
                  <Clock className="h-5 w-5 text-[#fcd34d]" />
                  <span>Mon-Fri: 9AM-6PM<br />Weekends: 8AM-8PM</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-sm border-[#fcd34d]/20">
              <CardHeader>
                <CardTitle className="text-[#fcd34d] text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-[#f59e0b] hover:bg-[#fcd34d] text-[#1e3a8a] font-semibold border border-[#fcd34d]"
                  onClick={() => window.open('https://web.facebook.com/profile.php?id=61576572946310', '_blank')}
                >
                  Follow us on Facebook
                </Button>
                <Button 
                  className="w-full bg-[#f59e0b] hover:bg-[#fcd34d] text-[#1e3a8a] font-semibold border border-[#fcd34d]"
                  onClick={() => window.location.href = 'mailto:info@tuskerscc.com'}
                >
                  Send us an Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-[#fcd34d]/20">
              <CardHeader>
                <CardTitle className="text-[#fcd34d] text-2xl">Send us a Message</CardTitle>
                <CardDescription className="text-[#bfdbfe]">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#fcd34d] mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-white/20 border-[#fcd34d]/30 text-white placeholder-[#bfdbfe] focus:border-[#fcd34d]"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#fcd34d] mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-white/20 border-[#fcd34d]/30 text-white placeholder-[#bfdbfe] focus:border-[#fcd34d]"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#fcd34d] mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white/20 border-[#fcd34d]/30 text-white placeholder-[#bfdbfe] focus:border-[#fcd34d]"
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-[#fcd34d] mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="bg-white/20 border-[#fcd34d]/30 text-white placeholder-[#bfdbfe] focus:border-[#fcd34d]"
                        placeholder="What is this regarding?"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#fcd34d] mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="bg-white/20 border-[#fcd34d]/30 text-white placeholder-[#bfdbfe] focus:border-[#fcd34d] resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-[#f59e0b] hover:bg-[#fcd34d] text-[#1e3a8a] font-semibold text-lg py-3 border border-[#fcd34d] transition-all duration-200"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-[#fcd34d]/20">
            <CardHeader>
              <CardTitle className="text-[#fcd34d] text-xl flex items-center">
                <img 
                  src="/attached_assets/image_1748762020608.png" 
                  alt="Join the Club" 
                  className="h-8 w-8 mr-3"
                />
                Join the Club
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#bfdbfe] mb-4">
                Become part of our cricket community and enjoy exclusive benefits, training sessions, and match opportunities.
              </p>
              <Button className="bg-[#f59e0b] hover:bg-[#fcd34d] text-[#1e3a8a] font-semibold border border-[#fcd34d]">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-[#fcd34d]/20">
            <CardHeader>
              <CardTitle className="text-[#fcd34d] text-xl flex items-center">
                <img 
                  src="/attached_assets/image_1748762020608.png" 
                  alt="Championships" 
                  className="h-8 w-8 mr-3"
                />
                Championships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#bfdbfe] mb-4">
                Learn about our tournament success and upcoming championship opportunities for all skill levels.
              </p>
              <Button className="bg-[#f59e0b] hover:bg-[#fcd34d] text-[#1e3a8a] font-semibold border border-[#fcd34d]">
                View Achievements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}