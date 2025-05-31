import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Users, Trophy } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#1e40af]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#fcd34d] mb-4">
            Contact Tuskers CC
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Get in touch with Kandy's premier cricket club. Whether you're interested in joining, 
            attending matches, or have questions about our facilities.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-blue-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-yellow-400">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-400">Email</p>
                    <p className="text-white">tuskerscckandy@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-400">Phone</p>
                    <p className="text-white">+94 XXX XXX XXX</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-400">Location</p>
                    <p className="text-white">Kandy, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-400">Office Hours</p>
                    <p className="text-white">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-white">Sat - Sun: 8:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6 text-center">
                  <Users className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Join the Club</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Become part of Kandy's cricket community
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-10 w-10 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Championships</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Learn about our tournament success
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Send us a Message</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                We'll get back to you within 24 hours
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Your last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input id="phone" type="tel" placeholder="+94 XXX XXX XXX" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What is this regarding?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us how we can help you..."
                  className="min-h-[120px]"
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </Button>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Your information is secure and will only be used to respond to your inquiry.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Visit Tuskers Cricket Ground
              </h3>
              <p className="text-lg mb-6">
                Experience the excitement of cricket in the heart of Kandy. Our ground features 
                modern facilities, excellent viewing areas, and a welcoming atmosphere for all cricket enthusiasts.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Match Days</h4>
                  <p>Experience live cricket action with our passionate fans</p>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Training Sessions</h4>
                  <p>Professional coaching available for all skill levels</p>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Event Hosting</h4>
                  <p>Ground available for tournaments and private events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}