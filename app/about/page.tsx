"use client";

import Navbar from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";
import { siteConfig } from "@/config/site";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-16">
        <div className="container max-w-4xl py-8 space-y-12 px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Sobre o {siteConfig.name}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {siteConfig.description}
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Nossa História</h2>
              <p className="text-muted-foreground">
                {siteConfig.about.history}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Nossa Missão</h2>
              <p className="text-muted-foreground">
                Buscamos ser a principal fonte de informação e comunidade para
                gamers no Brasil, oferecendo:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {siteConfig.about.mission.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Nossa Equipe</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {siteConfig.about.team.map((member) => (
                <Card key={member.name}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        {member.github && (
                          <Link
                            href={member.github}
                            className="text-muted-foreground hover:text-primary"
                            target="_blank"
                          >
                            <Github className="h-5 w-5" />
                          </Link>
                        )}
                        {member.linkedin && (
                          <Link
                            href={member.linkedin}
                            className="text-muted-foreground hover:text-primary"
                            target="_blank"
                          >
                            <Linkedin className="h-5 w-5" />
                          </Link>
                        )}
                        {member.twitter && (
                          <Link
                            href={member.twitter}
                            className="text-muted-foreground hover:text-primary"
                            target="_blank"
                          >
                            <Twitter className="h-5 w-5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Tecnologias</h2>
              <p className="text-muted-foreground">
                O {siteConfig.name} é construído com tecnologias modernas e de
                código aberto, incluindo:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {siteConfig.about.technologies.map((tech, index) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
