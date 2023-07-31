<?php

namespace App\Entity;

use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["projects"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["projects"])]
    private ?string $Title = null;
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(["projects"])]
    private ?\DateTimeInterface $CreationDate = null;

    #[ORM\ManyToOne(inversedBy: 'ProjectCreated')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["projects"])]
    private ?User $Creator = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'PorjectAffected')]
    #[Groups(["projects"])]
    private Collection $PUsers;


    #[ORM\OneToMany(mappedBy: 'IDproject', targetEntity: Doc::class)]
    private Collection $docs;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $StartDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $EndDate = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Description = null;

    public function __construct()
    {
        $this->PUsers = new ArrayCollection();
         $this->docs = new ArrayCollection();
    }



    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->Title;
    }

    public function setTitle(string $Title): self
    {
        $this->Title = $Title;

        return $this;
    }
 public function getCreationDate(): ?\DateTimeInterface
                               {
                                   return $this->CreationDate;
                               }

    public function setCreationDate(\DateTimeInterface $CreationDate): self
    {
        $this->CreationDate = $CreationDate;

        return $this;
    }

    public function getCreator(): ?User
    {
        return $this->Creator;
    }

    public function setCreator(?User $Creator): self
    {
        $this->Creator = $Creator;

        return $this;
    }
    public function setPUsers(?User $PUsers): self
    {
        $this->PUsers = $PUsers;

        return $this;
    }
    /**
     * @return Collection<int, User>
     */
    public function getPUsers(): Collection
    {
        return $this->PUsers;
    }

    public function addPUser(User $pUser): self
    {
        if (!$this->PUsers->contains($pUser)) {
            $this->PUsers->add($pUser);
        }

        return $this;
    }

    public function removePUser(User $pUser): self
    {
        $this->PUsers->removeElement($pUser);

        return $this;
    }
   /**
     * @return Collection<int, Doc>
     */
    public function getDocs(): Collection
    {
        return $this->docs;
    }
    public function setDocs(array $docs): self
    {
        $this->docs = $docs;

        return $this;
    }

    public function addDoc(Doc $doc): self
    {
        if (!$this->docs->contains($doc)) {
            $this->docs->add($doc);
            $doc->setIDproject($this);
        }

        return $this;
    }

    public function removeDoc(Doc $doc): self
    {
        if ($this->docs->removeElement($doc)) {
            // set the owning side to null (unless already changed)
            if ($doc->getIDproject() === $this) {
                $doc->setIDproject(null);
            }
        }

        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->StartDate;
    }

    public function setStartDate(?\DateTimeInterface $StartDate): self
    {
        $this->StartDate = $StartDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->EndDate;
    }

    public function setEndDate(?\DateTimeInterface $EndDate): self
    {
        $this->EndDate = $EndDate;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->Description;
    }

    public function setDescription(?string $Description): self
    {
        $this->Description = $Description;

        return $this;
    }





}
