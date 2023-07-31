<?php

namespace App\Entity;

use App\Repository\DocRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocRepository::class)]
class Doc
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Titre = null;

    #[ORM\Column(length: 255)]
    private ?string $Type = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $CreatedAT = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $UpdatedAT = null;


    #[ORM\ManyToOne(inversedBy: 'docs')]
    private ?Project $IDproject = null;

    #[ORM\OneToMany(mappedBy: 'doc', targetEntity: Element::class)]
    private Collection $Element;
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $UpdatedBy = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $CreatedBy = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'docs')]
    private ?self $IdCloned = null;

    #[ORM\OneToMany(mappedBy: 'IdCloned', targetEntity: self::class)]
    private Collection $docs;

    #[ORM\OneToMany(mappedBy: 'Doc', targetEntity: History::class)]
    private Collection $histories;


    public function __construct()
    {
        $this->Element = new ArrayCollection();
        $this->docs = new ArrayCollection();
        $this->histories = new ArrayCollection();

    }



    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->Titre;
    }

    public function setTitre(string $Titre): self
    {
        $this->Titre = $Titre;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->Type;
    }

    public function setType(string $Type): self
    {
        $this->Type = $Type;

        return $this;
    }

    public function getCreatedAT(): ?\DateTimeInterface
    {
        return $this->CreatedAT;
    }

    public function setCreatedAT(\DateTimeInterface $CreatedAT): self
    {
        $this->CreatedAT = $CreatedAT;

        return $this;
    }

    public function getUpdatedAT(): ?\DateTimeInterface
    {
        return $this->UpdatedAT;
    }

    public function setUpdatedAT(\DateTimeInterface $UpdatedAT): self
    {
        $this->UpdatedAT = $UpdatedAT;

        return $this;
    }

    public function getIDproject(): ?Project
    {
        return $this->IDproject;
    }

    public function setIDproject(?Project $IDproject): self
    {
        $this->IDproject = $IDproject;

        return $this;
    }

    /**
     * @return Collection<int, Element>
     */
    public function getElement(): Collection
    {
        return $this->Element;
    }

    public function addElement(Element $element): self
    {
        if (!$this->Element->contains($element)) {
            $this->Element->add($element);
            $element->setDoc($this);
        }

        return $this;
    }

    public function removeElement(Element $element): self
    {
        if ($this->Element->removeElement($element)) {
            // set the owning side to null (unless already changed)
            if ($element->getDoc() === $this) {
                $element->setDoc(null);
            }
        }

        return $this;
    }
    public function getUpdatedBy(): ?string
    {
        return $this->UpdatedBy;
    }

    public function setUpdatedBy(?string $UpdatedBy): self
    {
        $this->UpdatedBy = $UpdatedBy;

        return $this;
    }

    public function getCreatedBy(): ?string
    {
        return $this->CreatedBy;
    }

    public function setCreatedBy(?string $CreatedBy): self
    {
        $this->CreatedBy = $CreatedBy;

        return $this;
    }

    public function getIdCloned(): ?self
    {
        return $this->IdCloned;
    }

    public function setIdCloned(?self $IdCloned): self
    {
        $this->IdCloned = $IdCloned;

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getDocs(): Collection
    {
        return $this->docs;
    }

    public function addDoc(self $doc): self
    {
        if (!$this->docs->contains($doc)) {
            $this->docs->add($doc);
            $doc->setIdCloned($this);
        }

        return $this;
    }

    public function removeDoc(self $doc): self
    {
        if ($this->docs->removeElement($doc)) {
            // set the owning side to null (unless already changed)
            if ($doc->getIdCloned() === $this) {
                $doc->setIdCloned(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, History>
     */
    public function getHistories(): Collection
    {
        return $this->histories;
    }
    /**
     * @return Collection<int, History>
     */
    public function setHistories(): Collection
    {
        return $this->histories;
    }
    public function addHistory(History $history): self
    {
        if (!$this->histories->contains($history)) {
            $this->histories->add($history);
            $history->setDoc($this);
        }

        return $this;
    }

    public function removeHistory(History $history): self
    {
        if ($this->histories->removeElement($history)) {
            // set the owning side to null (unless already changed)
            if ($history->getDoc() === $this) {
                $history->setDoc(null);
            }
        }

        return $this;
    }


}
