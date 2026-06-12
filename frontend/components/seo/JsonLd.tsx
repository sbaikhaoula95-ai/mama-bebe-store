import { PRODUCTS_LIST } from "@/config/products";

function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "حنينة - Hnina",
    url: "https://hnina.shop",
    logo: "https://hnina.shop/images/brand/hnina-logo-icon.png",
    description:
      "حنينة علامة مغربية للعناية الطبيعية بماما والبيبي. مكونات طبيعية، لطيفة، ومفهومة.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Arabic", "French"],
    },
    sameAs: [
      "https://instagram.com/hnina.shop",
      "https://facebook.com/hnina.shop",
      "https://tiktok.com/@hnina.shop",
    ],
  };
}

function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "حنينة",
    alternateName: "Hnina",
    url: "https://hnina.shop",
    inLanguage: "ar",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://hnina.shop/products?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

function getProductListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "منتجات حنينة",
    numberOfItems: PRODUCTS_LIST.length,
    itemListElement: PRODUCTS_LIST.map((product, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: product.arabicName,
        description: product.subheading,
        url: `https://hnina.shop/products/${product.slug}`,
        image: `https://hnina.shop/images/products/${product.slug.replace("hnina-", "hnina-")}-hero.png`,
        brand: {
          "@type": "Brand",
          name: "Hnina",
        },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "MAD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
          shippingDetails: {
            "@type": "OfferShippingDetails",
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 1,
                maxValue: 2,
                unitCode: "DAY",
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 1,
                maxValue: 2,
                unitCode: "DAY",
              },
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "MA",
            },
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          reviewCount: product.reviews.length.toString(),
          bestRating: "5",
          worstRating: "1",
        },
      },
    })),
  };
}

function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "واش المنتجات مامونة؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نعم، كل منتجات حنينة مصممة بمكونات طبيعية، لطيفة على البشرة الحساسة.",
        },
      },
      {
        "@type": "Question",
        name: "واش نقدر نخلص عند الاستلام؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "بالتأكيد. الدفع عند الاستلام هو الطريقة الوحيدة للدفع. ما تخلصي والو حتى يوصلك الطلب.",
        },
      },
      {
        "@type": "Question",
        name: "شحال كيوصل الطلب؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "التوصيل في 24-48 ساعة في معظم مدن المغرب.",
        },
      },
    ],
  };
}

export function HomeJsonLd() {
  const schemas = [
    getOrganizationSchema(),
    getWebsiteSchema(),
    getProductListSchema(),
    getFAQSchema(),
  ];

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
