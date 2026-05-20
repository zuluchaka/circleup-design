// Shared current-user fixture for design previews.
// Real app sources this from the auth/identity layer.
// `isCircleManager` mirrors the Rails `users.is_mafao_employee` + `CircleManagerProfile` association.

export const CURRENT_USER = {
  name: "Aminata Diallo",
  greeting: "Find your next circle",
  avatar:
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop",
  trustScore: 945,
  associations: 2,
  // Mafao employees with an active CircleManagerProfile see B2B surfaces.
  isCircleManager: true,
  employeeId: "MAF-0142",
  cmMaxCircles: 12,
  cmActiveCircles: 7,
};
