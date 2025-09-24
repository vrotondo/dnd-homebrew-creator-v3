// src/pages/AboutPage.jsx
import { Card, CardContent, CardHeader, Alert, Badge } from '../components/ui';
import { Shield, Heart, Users, Zap, Github, Globe } from 'lucide-react';

function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    About D&D Homebrew Creator
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                    Empowering dungeon masters and players to create amazing custom content
                </p>
                <div className="flex justify-center space-x-3">
                    <Badge variant="primary">Version 3.0</Badge>
                    <Badge variant="success">SRD Compliant</Badge>
                    <Badge variant="outline">Open Source</Badge>
                </div>
            </div>

            {/* What is this section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">What is D&D Homebrew Creator?</h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        D&D Homebrew Creator is a free, modern web application that helps Dungeon Masters and players
                        create, manage, and export their own custom content for Dungeons & Dragons 5th Edition. Our
                        tool ensures your homebrew content remains compliant with the Systems Reference Document (SRD)
                        guidelines, allowing you to safely share your creations without copyright concerns.
                    </p>
                </CardContent>
            </Card>

            {/* Features Grid */}
            <div
                className="grid gap-6"
                style={{
                    gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(2, minmax(0, 1fr))' : '1fr'
                }}
            >
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Character Creation</h3>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">
                            Build custom character classes, subclasses, races, and backgrounds with our intuitive creator tools.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• 20-level class progression system</li>
                            <li>• Subclass and archetype support</li>
                            <li>• Racial traits and abilities</li>
                            <li>• Background features and equipment</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">SRD Compliance</h3>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">
                            Built-in validation ensures your homebrew content follows official guidelines and can be safely shared.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Automatic SRD compliance checking</li>
                            <li>• Reference to official content</li>
                            <li>• Safe sharing guidelines</li>
                            <li>• Copyright-friendly exports</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* SRD Compliance Alert */}
            <Alert variant="info" title="Systems Reference Document (SRD) Compliance">
                This tool is designed to help ensure your homebrew content complies with the Systems Reference Document
                guidelines established by Wizards of the Coast. The SRD allows creators to reference and build upon
                certain D&D 5th Edition content while respecting intellectual property rights. Always review the
                current SRD guidelines before sharing your homebrew content publicly.
            </Alert>

            {/* Privacy & Data */}
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Heart className="w-5 h-5 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Privacy & Data</h3>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600">
                        Your privacy and data security are important to us. Here's how we handle your information:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Local Storage</h4>
                            <p className="text-sm text-gray-600">
                                All your creations are stored locally in your browser. Nothing is sent to external servers.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">No Tracking</h4>
                            <p className="text-sm text-gray-600">
                                We don't collect personal data, usage analytics, or track your activity.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Export Control</h4>
                            <p className="text-sm text-gray-600">
                                You have full control over your data and can export it at any time for backup.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Open Source</h4>
                            <p className="text-sm text-gray-600">
                                The code is open source, so you can verify our privacy practices yourself.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Technical Info */}
            <Card>
                <CardHeader>
                    <h3 className="text-xl font-semibold text-gray-900">Technical Information</h3>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Globe className="w-6 h-6 text-purple-600" />
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">Modern Web App</h4>
                            <p className="text-sm text-gray-600">
                                Built with React 19 and modern web standards for a fast, responsive experience.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">D&D 5e API</h4>
                            <p className="text-sm text-gray-600">
                                Integrates with the official D&D 5e API for reference data and validation.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Heart className="w-6 h-6 text-green-600" />
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">Mobile Friendly</h4>
                            <p className="text-sm text-gray-600">
                                Responsive design that works beautifully on desktop, tablet, and mobile devices.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center py-8">
                <p className="text-gray-500 mb-2">
                    D&D Homebrew Creator is not affiliated with Wizards of the Coast.
                </p>
                <p className="text-gray-500">
                    Dungeons & Dragons and D&D are trademarks of Wizards of the Coast LLC.
                </p>
            </div>
        </div>
    );
}

export default AboutPage;