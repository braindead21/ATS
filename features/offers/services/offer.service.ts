import { Offer, OfferStatus } from "@/types";
import { mockOffers } from "@/lib/mock-data";

let offers: Offer[] = [...mockOffers];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const offerService = {
  async getAll(): Promise<Offer[]> {
    await delay(300);
    return [...offers];
  },

  async getByCandidate(candidateId: string): Promise<Offer | null> {
    await delay(300);
    return offers.find((offer) => offer.candidateId === candidateId) || null;
  },

  async getById(id: string): Promise<Offer | null> {
    await delay(300);
    return offers.find((offer) => offer.id === id) || null;
  },

  async create(
    data: Omit<Offer, "id" | "createdAt" | "updatedAt">
  ): Promise<Offer> {
    await delay(400);
    const newOffer: Offer = {
      ...data,
      id: `offer${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    offers.push(newOffer);
    return newOffer;
  },

  async update(
    id: string,
    data: Partial<Omit<Offer, "id" | "createdAt" | "updatedAt">>
  ): Promise<Offer | null> {
    await delay(400);
    const index = offers.findIndex((offer) => offer.id === id);
    if (index === -1) return null;

    offers[index] = {
      ...offers[index],
      ...data,
      updatedAt: new Date(),
    };
    return offers[index];
  },

  async updateStatus(
    id: string,
    status: OfferStatus
  ): Promise<Offer | null> {
    await delay(400);
    const index = offers.findIndex((offer) => offer.id === id);
    if (index === -1) return null;

    offers[index] = {
      ...offers[index],
      status,
      updatedAt: new Date(),
    };
    return offers[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay(400);
    const index = offers.findIndex((offer) => offer.id === id);
    if (index === -1) return false;

    offers.splice(index, 1);
    return true;
  },
};
