<?php

namespace App\Entity;

use App\Repository\ElementRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ElementRepository::class)]
class Element
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Type = null;

    #[ORM\ManyToOne(inversedBy: 'Element')]
    private ?Doc $doc = null;

    #[ORM\Column(nullable: true)]
    private ?int $Sequence = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Typeofvalue = null;

    #[ORM\Column(nullable: true)]
    private array $Value = [];

    public function getId(): ?int
    {
        return $this->id;
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

    public function getDoc(): ?Doc
    {
        return $this->doc;
    }

    public function setDoc(?Doc $doc): self
    {
        $this->doc = $doc;

        return $this;
    }

    public function getSequence(): ?int
    {
        return $this->Sequence;
    }

    public function setSequence(?int $Sequence): self
    {
        $this->Sequence = $Sequence;

        return $this;
    }

    public function getTypeofvalue(): ?string
    {
        return $this->Typeofvalue;
    }

    public function setTypeofvalue(?string $Typeofvalue): self
    {
        $this->Typeofvalue = $Typeofvalue;

        return $this;
    }

    public function getValue(): array
    {
        return $this->Value;
    }

    public function setValue(?array $Value): self
    {
        $this->Value = $Value;

        return $this;
    }

  
}
