"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
  Phone,
  MapPin,
  Clock,
  Send,
  Shield,
  Globe,
  Star,
  Heart,
  Code,
  Zap
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

type SubmitStatus = 'success' | 'error' | null;

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  // Replace with your actual Web3Forms API key
  const API_KEY = "408f0b49-e79f-47f0-ad3e-e11724ccc28a";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Updated to use your Next.js API route instead of direct Web3Forms
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: API_KEY,
          subject: "New Contact from MediQuery Website",
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          from_name: formData.name.trim(),
          reply_to: formData.email.trim(),
          source: "MediQuery Website Contact Form",
          platform: "Web Application"
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        console.error('Form submission failed:', result);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@mediquery.com",
      description: "Get help via email",
      color: "text-blue-500"
    },
    {
      icon: Phone,
      title: "Phone Support",
      value: "+1 (555) 123-4567",
      description: "Call us directly",
      color: "text-green-500"
    },
    {
      icon: MapPin,
      title: "Office Location",
      value: "123 Health Street",
      description: "Medical City, MC 12345",
      color: "text-red-500"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "24-48 Hours",
      description: "Average response time",
      color: "text-purple-500"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected"
    },
    {
      icon: Zap,
      title: "Fast Response",
      description: "Quick reply guaranteed"
    },
    {
      icon: Globe,
      title: "Web Integration",
      description: "Seamless web experience"
    },
    {
      icon: Heart,
      title: "Made with Care",
      description: "Built for healthcare"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about MediQuery? We'd love to hear from you and help with any inquiries!
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Contact Form - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card className="h-full shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-5">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center text-2xl">
                  <MessageSquare className="h-6 w-6 mr-3 text-blue-500" />
                  Send us a Message
                </CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      <div className="font-medium">✅ Message sent successfully!</div>
                      <div className="text-sm mt-1">
                        📧 Your message has been delivered from the MediQuery website. We'll respond within 24-48 hours.
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === 'error' && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      ❌ Failed to send message. Please check your details and try again.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center text-sm font-medium">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center text-sm font-medium">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="your.email@example.com"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center text-sm font-medium">
                    <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                    Your Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="resize-none"
                    required
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full h-12 text-lg font-medium bg-secondary hover:to-green-600 border-2 border-gray-400 transition-all duration-200"
                  disabled={isSubmitting}
                  type="button"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Message...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </div>
                  )}
                </Button>

                {/* Form Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div className="text-sm">
                      <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Secure Contact Form
                      </div>
                      <div className="text-blue-700 dark:text-blue-300">
                        This form is powered by Web3Forms via our secure API. Your message will be tagged as coming from the MediQuery website for easy identification.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Methods - Takes 1 column */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Phone className="h-5 w-5 mr-2 text-green-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`p-2 rounded-full bg-muted ${method.color}`}>
                      <method.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{method.title}</div>
                      <div className="text-sm text-foreground font-mono">{method.value}</div>
                      <div className="text-xs text-muted-foreground">{method.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Why Contact Us?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium text-sm">{feature.title}</div>
                      <div className="text-xs text-muted-foreground">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Developer Credits */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Code className="h-5 w-5 mr-2 text-purple-500" />
                Developer Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-foreground">
                  MediQuery was crafted by passionate developers and AI enthusiasts, creating an innovative platform for preliminary health guidance powered by artificial intelligence.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">Next.js</span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">ShadCN UI</span>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">Gemini AI</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Status */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Form Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Form is Live & Ready</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This contact form is now properly configured with a secure API route. All messages are automatically tagged with source information to identify they came from the MediQuery website.
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  <span>Secure API Integration Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}