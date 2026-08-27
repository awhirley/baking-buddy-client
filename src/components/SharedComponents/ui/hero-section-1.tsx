"use client";

import { Button } from "#components/SharedComponents/ui/button";
import { Tagline } from "#components/SharedComponents/ui/tagline";
import { AspectRatio } from "#components/SharedComponents/ui/aspect-ratio";
import { ArrowUpRight } from "lucide-react";
import { H1, P } from "./typography";

import kitchenImage from "../../../assets/kitchen.jpg";


export function HeroSection1() {
  return (
    <section
      className="bg-background section-padding-y"
      aria-labelledby="hero-heading"
    >
      <div className="container-padding-x mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col gap-6 lg:gap-8">
          <div className="section-title-gap-xl flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* <Tagline variant="link">
              <span className="size-1.5 rounded-full bg-green-500" />
              <span className="hidden lg:inline">What's new · </span>
              <span className="lg:text-muted-foreground">
                Just shipped v2.0
              </span>
              <ArrowUpRight />
            </Tagline> */}
            <H1 className="heading-xl">
              Track your recipe adjustments and bake results
            </H1>
            <P className="text-muted-foreground text-lg/8 text-pretty">
              See ingredient and instruction history, take notes,  & rate and upload pictures of your bakes.
              Organize and tag your recipes to find easily later on.
            </P>
          </div>
          <div className="flex items-center justify-center gap-2 lg:justify-start">
            <Button>Get started</Button>
            <Button variant="secondary">Learn more</Button>
          </div>
        </div>

        <div className="w-full flex-1">
          <AspectRatio ratio={1 / 1}>
            <img src={kitchenImage} alt="kitchen" className="rounded-xl" />
          </AspectRatio>
        </div>
      </div>
    </section>
  );
}
