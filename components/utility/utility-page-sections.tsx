import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryLabel } from "@/lib/utilities/categories";
import { getRelatedUtilities } from "@/lib/utilities/related";
import type { UtilityManifest } from "@/lib/utilities/types";

interface UtilityPageSectionsProps {
  manifest: UtilityManifest;
}

export function UtilityPageSections({ manifest }: UtilityPageSectionsProps) {
  const relatedUtilities = getRelatedUtilities(manifest, 4);

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardContent className="pt-1">
          <article className="mx-auto w-full max-w-3xl">
            <section className="space-y-4 py-5 first:pt-2">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                How to use this tool
              </h3>
              <ol className="list-decimal list-inside space-y-2.5 text-sm text-muted-foreground">
                {manifest.content.howToSteps.map((step) => (
                  <li key={step} className="leading-7">
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-6 mb-4 h-px bg-border" aria-hidden="true" />

            <section className="space-y-4 py-6">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                About {manifest.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {manifest.content.about}
              </p>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">
                  Common use cases
                </h4>
                <ul className="list-disc list-inside space-y-2.5 text-sm text-muted-foreground">
                  {manifest.content.useCases.map((useCase) => (
                    <li key={useCase} className="leading-7">
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <div className="mt-6 mb-4 h-px bg-border" aria-hidden="true" />

            <section className="space-y-4 py-6 last:pb-1">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                FAQ
              </h3>
              <dl className="space-y-6">
                {manifest.content.faqs.map((faq) => (
                  <div key={faq.question} className="space-y-2.5">
                    <dt className="text-sm font-medium leading-6 text-foreground">
                      {faq.question}
                    </dt>
                    <dd className="text-sm leading-7 text-muted-foreground">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </article>
        </CardContent>
      </Card>

      {relatedUtilities.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Related tools</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedUtilities.map((utility) => {
              const IconComponent = utility.icon;
              return (
                <Link
                  href={`/${utility.slug}`}
                  key={utility.id}
                  className="block"
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(utility.category)}
                        </Badge>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {utility.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {utility.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
